export interface Cliente {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  active: boolean;
}

export interface ClienteCreateDto {
  name: string;
  phone?: string;
  email?: string;
  active: boolean;
}

export interface Atendimento {
  id: string;
  data: string;
  clientId: string;
  clienteNome: string; // vem do JOIN do backend
  tipoSessao: string;
  valorSessao: number;
  percentualRepasse: number;
  valorRepasse: number;
}

export interface AtendimentoCreateDto {
  data: string;
  clientId: string;
  tipoSessao: string;
  valorSessao: number;
  percentualRepasse: number;
}

export interface Dashboard {
  receita: number;
  repasse: number;
  lucro: number;
  quantidadeAtendimentos: number;
}

export interface FaturamentoMensal {
  mes: number;
  receita: number;
}

export interface Dashboard {
  receita: number;
  repasse: number;
  lucro: number;
  quantidadeAtendimentos: number;
}

export interface FaturamentoMensal {
  mes: number;
  receita: number;
}

export interface Usuario {
  id: string;
  email: string;
  createdAt?: string;
  lastSignInAt?: string;
}