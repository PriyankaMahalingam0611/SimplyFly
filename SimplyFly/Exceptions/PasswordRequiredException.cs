using System;

namespace SimplyFly.Exceptions
{
    public class PasswordRequiredException : Exception
    {
        public PasswordRequiredException() : base("Password is required.")
        {
        }
    }
}