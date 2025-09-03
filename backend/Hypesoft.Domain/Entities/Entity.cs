
using System;

namespace Hypesoft.Domain.Entities
{
    public abstract class Entity
    {
        public Guid Id { get; internal set; }
    }
}