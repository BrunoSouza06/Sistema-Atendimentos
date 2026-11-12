namespace backend.DTOs;

public class DashboardDto
{
    public decimal Receita { get; set; }
    public decimal Repasse { get; set; }
    public decimal Lucro { get; set; }
    public long QuantidadeAtendimentos { get; set; }
}