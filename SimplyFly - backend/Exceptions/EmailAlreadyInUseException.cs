using System;

namespace SimplyFly.Exceptions
{
    public class EmailAlreadyInUseException : Exception
    {
        public EmailAlreadyInUseException() : base("Email is already in use.")
        {
        }
    }
}