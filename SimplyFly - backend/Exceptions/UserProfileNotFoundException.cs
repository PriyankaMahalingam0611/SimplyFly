using System;

namespace SimplyFly.Exceptions
{
    public class UserProfileNotFoundException : Exception
    {
        public UserProfileNotFoundException() : base("User profile was not found.")
        {
        }
    }
}