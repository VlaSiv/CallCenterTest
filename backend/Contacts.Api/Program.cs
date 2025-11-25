using Contacts.Api.Constants;
using Contacts.Api.Data;
using Contacts.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddDbContext<ContactsDbContext>(options =>
    options.UseSqlite(AppConstants.ConnectionString));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();

await DbInitializer.InitializeAsync(app.Services);

app.MapGet(RouteNames.GetContacts, async (
    ContactsDbContext db,
    string? q,
    string? sortBy,
    string? sortDir,
    int? page,
    int? pageSize) =>
{
    var query = db.Contacts.AsNoTracking().AsQueryable();

    query = ApplySearch(query, q);
    query = ApplySorting(query, sortBy, sortDir);

    var (p, ps) = GetPagination(page, pageSize);

    var totalCount = await query.CountAsync();
    var items = await query.Skip((p - 1) * ps).Take(ps).ToListAsync();

    return Results.Ok(new
    {
        items,
        totalCount,
        page = p,
        pageSize = ps
    });
})
.WithName(RouteNames.GetContactsName);

app.Run();

static IQueryable<Contact> ApplySearch(IQueryable<Contact> query, string? q)
{
    if (string.IsNullOrWhiteSpace(q))
    {
        return query;
    }

    var term = q.Trim();
    var likePattern = BuildContainsPattern(term);
    var collation = AppConstants.Collations.CaseInsensitive;
    const string EscapeChar = "\\";

    return query.Where(c =>
        EF.Functions.Like(EF.Functions.Collate(c.FirstName, collation), likePattern, EscapeChar) ||
        EF.Functions.Like(EF.Functions.Collate(c.LastName, collation), likePattern, EscapeChar) ||
        EF.Functions.Like(EF.Functions.Collate(c.Email, collation), likePattern, EscapeChar) ||
        EF.Functions.Like(c.Phone, likePattern, EscapeChar) ||
        EF.Functions.Like(EF.Functions.Collate(c.City, collation), likePattern, EscapeChar) ||
        EF.Functions.Like(EF.Functions.Collate(c.State, collation), likePattern, EscapeChar));
}

static string BuildContainsPattern(string term)
{
    var sanitized = term
        .Replace("\\", "\\\\")
        .Replace("%", "\\%")
        .Replace("_", "\\_");

    return $"%{sanitized}%";
}

static IQueryable<Contact> ApplySorting(IQueryable<Contact> query, string? sortBy, string? sortDir)
{
    var isAsc = sortDir?.ToLower() == AppConstants.Sorting.Ascending;
    return sortBy?.ToLower() switch
    {
        AppConstants.Sorting.FirstName => isAsc ? query.OrderBy(c => c.FirstName) : query.OrderByDescending(c => c.FirstName),
        AppConstants.Sorting.LastName => isAsc ? query.OrderBy(c => c.LastName) : query.OrderByDescending(c => c.LastName),
        AppConstants.Sorting.Email => isAsc ? query.OrderBy(c => c.Email) : query.OrderByDescending(c => c.Email),
        AppConstants.Sorting.Phone => isAsc ? query.OrderBy(c => c.Phone) : query.OrderByDescending(c => c.Phone),
        AppConstants.Sorting.City => isAsc ? query.OrderBy(c => c.City) : query.OrderByDescending(c => c.City),
        AppConstants.Sorting.State => isAsc ? query.OrderBy(c => c.State) : query.OrderByDescending(c => c.State),
        AppConstants.Sorting.Age => isAsc ? query.OrderBy(c => c.Age) : query.OrderByDescending(c => c.Age),
        AppConstants.Sorting.Status => isAsc ? query.OrderBy(c => c.Status) : query.OrderByDescending(c => c.Status),
        _ => query.OrderBy(c => c.Id)
    };
}

static (int page, int pageSize) GetPagination(int? page, int? pageSize)
{
    var p = page ?? AppConstants.Pagination.DefaultPage;
    var ps = pageSize ?? AppConstants.Pagination.DefaultPageSize;
    if (ps > AppConstants.Pagination.MaxPageSize)
    {
        ps = AppConstants.Pagination.MaxPageSize;
    }
    return (p, ps);
}
