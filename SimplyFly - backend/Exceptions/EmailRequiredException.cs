using System;

namespace SimplyFly.Exceptions
{
    public class EmailRequiredException : Exception
    {
        public EmailRequiredException() : base("Email is required.")
        {
        }
    }
}