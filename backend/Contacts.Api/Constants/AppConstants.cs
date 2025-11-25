namespace Contacts.Api.Constants;

public static class AppConstants
{
    public const string ConnectionString = "Data Source=contacts.db";
    public const string CorsPolicy = "DefaultPolicy";
    
    public static class Pagination
    {
        public const int DefaultPage = 1;
        public const int DefaultPageSize = 50;
        public const int MaxPageSize = 200;
    }

    public static class Sorting
    {
        public const string Ascending = "asc";
        public const string Descending = "desc";
        
        public const string FirstName = "firstname";
        public const string LastName = "lastname";
        public const string Email = "email";
        public const string Phone = "phone";
        public const string City = "city";
        public const string State = "state";
        public const string Age = "age";
        public const string Status = "status";
    }

    public static class Collations
    {
        public const string CaseInsensitive = "NOCASE";
    }

    public static class Data
    {
        public const string CsvEnvVar = "CSV_PATH";
        public const string CsvPathFromBin = "../../../data/contacts_500k.csv";
        public const string CsvPathFromRoot = "../../data/contacts_500k.csv";
        public const int ImportBatchSize = 5000;
    }

    public static class CsvHeaders
    {
        public const string Id = "id";
        public const string FirstName = "first_name";
        public const string LastName = "last_name";
        public const string Phone = "phone";
        public const string Email = "email";
        public const string Address = "address";
        public const string City = "city";
        public const string State = "state";
        public const string Zip = "zip";
        public const string Age = "age";
        public const string Status = "status";
    }
}
