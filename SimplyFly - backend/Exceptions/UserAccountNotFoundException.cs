using System;

namespace SimplyFly.Exceptions
{
    public class UserAccountNotFoundException : Exception
    {
        public UserAccountNotFoundException() : base("User account was not found.")
        {
        }
    }
}