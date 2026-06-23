using System;

namespace SimplyFly.Exceptions
{
    public class CabinNotFoundException : Exception
    {
        public CabinNotFoundException() : base("Target cabin tier was not found.")
        {
        }
    }
}