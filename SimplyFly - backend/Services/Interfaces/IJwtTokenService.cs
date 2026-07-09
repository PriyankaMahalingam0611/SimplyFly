using SimplyFly.Models;
using System.Collections.Generic;

namespace SimplyFly.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user, List<string> roles, out DateTime expiresAt);
    }
}