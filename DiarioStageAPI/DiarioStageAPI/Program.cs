using DiarioStageAPI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Registriamo il nuovo servizio basato su file JSON
builder.Services.AddScoped<JsonStorageService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5000);
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();