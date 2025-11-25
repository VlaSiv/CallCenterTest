using System.Globalization;
using Contacts.Api.Constants;
using Contacts.Api.Models;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ContactsDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ContactsDbContext>>();

        await context.Database.EnsureCreatedAsync();

        if (await context.Contacts.AnyAsync())
        {
            return;
        }

        logger.LogInformation(LogMessages.SeedingDatabase);

        var csvPath = GetCsvFilePath();
        if (!File.Exists(csvPath))
        {
            logger.LogError(LogMessages.CsvFileNotFound, csvPath);
            return;
        }

        await ImportContactsAsync(context, csvPath, logger);
    }

    private static string GetCsvFilePath()
    {
        var csvPath = Environment.GetEnvironmentVariable(AppConstants.Data.CsvEnvVar);
        if (!string.IsNullOrEmpty(csvPath))
        {
            return csvPath;
        }

        var currentDir = Directory.GetCurrentDirectory();
        var pathFromBin = Path.Combine(currentDir, AppConstants.Data.CsvPathFromBin);
        
        if (File.Exists(pathFromBin))
        {
             return pathFromBin;
        }

        return Path.Combine(currentDir, AppConstants.Data.CsvPathFromRoot);
    }

    private static async Task ImportContactsAsync(ContactsDbContext context, string csvPath, ILogger logger)
    {
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HeaderValidated = null,
            MissingFieldFound = null,
            PrepareHeaderForMatch = args => args.Header.ToLower(),
        });

        csv.Context.RegisterClassMap<ContactMap>();

        var contacts = csv.GetRecordsAsync<Contact>();
        
        var batchSize = AppConstants.Data.ImportBatchSize;
        var batch = new List<Contact>(batchSize);
        int totalRows = 0;

        await foreach (var contact in contacts)
        {
            batch.Add(contact);
            if (batch.Count >= batchSize)
            {
                await SaveBatchAsync(context, batch);
                totalRows += batch.Count;
                logger.LogInformation(LogMessages.ImportedRows, totalRows);
                batch.Clear();
            }
        }

        if (batch.Count > 0)
        {
            await SaveBatchAsync(context, batch);
            totalRows += batch.Count;
        }

        logger.LogInformation(LogMessages.FinishedSeeding, totalRows);
    }

    private static async Task SaveBatchAsync(ContactsDbContext context, List<Contact> batch)
    {
        await context.Contacts.AddRangeAsync(batch);
        await context.SaveChangesAsync();
        context.ChangeTracker.Clear();
    }
}

public class ContactMap : ClassMap<Contact>
{
    public ContactMap()
    {
        Map(m => m.Id).Name(AppConstants.CsvHeaders.Id);
        Map(m => m.FirstName).Name(AppConstants.CsvHeaders.FirstName);
        Map(m => m.LastName).Name(AppConstants.CsvHeaders.LastName);
        Map(m => m.Phone).Name(AppConstants.CsvHeaders.Phone);
        Map(m => m.Email).Name(AppConstants.CsvHeaders.Email);
        Map(m => m.Address).Name(AppConstants.CsvHeaders.Address);
        Map(m => m.City).Name(AppConstants.CsvHeaders.City);
        Map(m => m.State).Name(AppConstants.CsvHeaders.State);
        Map(m => m.Zip).Name(AppConstants.CsvHeaders.Zip);
        Map(m => m.Age).Name(AppConstants.CsvHeaders.Age);
        Map(m => m.Status).Name(AppConstants.CsvHeaders.Status);
    }
}