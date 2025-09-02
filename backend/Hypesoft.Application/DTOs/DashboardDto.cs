
using System.Collections.Generic;

namespace Hypesoft.Application.DTOs
{
    public class DashboardDto
    {
        public int TotalProducts { get; set; }
        public int TotalCategories { get; set; }
        public decimal TotalValue { get; set; }
        public int LowStockProducts { get; set; }
    }
}