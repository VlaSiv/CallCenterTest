using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Api.Models;

[Index(nameof(LastName))]
[Index(nameof(FirstName))]
[Index(nameof(Email))]
[Index(nameof(Phone))]
[Index(nameof(City))]
[Index(nameof(State))]
public class Contact
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Status { get; set; } = string.Empty;
}