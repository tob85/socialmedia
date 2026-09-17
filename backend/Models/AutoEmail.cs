namespace Backend.Models;

public class AutoEmail
{
    public long Id { get; set; }

    public string Recipient { get; set; } = "";

    public string Subject { get; set; } = "";

    public string Body { get; set; } = "";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset? SentAt { get; set; }

    public int Attempts { get; set; }

    public string? Error { get; set; }
}
