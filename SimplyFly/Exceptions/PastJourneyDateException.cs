using System;

namespace SimplyFly.Exceptions
{
    public class PastJourneyDateException : Exception
    {
        public PastJourneyDateException() : base("Journey date cannot be in the past.")
        {
        }
    }
}