import {
  Atendimento,
  AtendimentoCreateDto,
  Cliente,
  ClienteCreateDto,
  Dashboard,
  FaturamentoMensal,
  Usuario
} from "./types";
import { supabase } from "./lib/supabaseClient";

const API_URL = "http://localhost:5228/api/atendimentos";
const CLIENTES_URL = "http://localhost:5228/api/clientes";
const DASHBOARD_URL = "http://localhost:5228/api/dashboard";
const USUARIOS_URL = "http://localhost:5228/api/usuarios";

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAtendimentos(
  mes: number,
  ano: number,
): Promise<Atendimento[]> {
  const res = await fetch(`${API_URL}?mes=${mes}&ano=${ano}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar atendimentos");
  return res.json();
}

export async function createAtendimento(
  dto: AtendimentoCreateDto,
): Promise<Atendimento> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Erro ao criar atendimento");
  return res.json();
}

export async function updateAtendimento(
  id: string,
  dto: AtendimentoCreateDto,
): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Erro ao editar atendimento");
}

export async function deleteAtendimento(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao excluir atendimento");
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(CLIENTES_URL, {
    headers: await authHeaders(),
  });

  if (!res.ok) {
    console.log(await res.text());
    throw new Error("Erro ao buscar clientes");
  }

  return res.json();
}

export async function createCliente(dto: ClienteCreateDto): Promise<Cliente> {
  const res = await fetch(CLIENTES_URL, {
    method: "POST",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Erro ao criar cliente");
  return res.json();
}

export async function updateCliente(
  id: string,
  dto: ClienteCreateDto,
): Promise<void> {
  const res = await fetch(`${CLIENTES_URL}/${id}`, {
    method: "PUT",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Erro ao atualizar cliente");
}

export async function deleteCliente(id: string): Promise<void> {
  const res = await fetch(`${CLIENTES_URL}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir cliente");
  }
}

export async function getDashboard(
  mes: number,
  ano: number,
): Promise<Dashboard> {
  const res = await fetch(`${DASHBOARD_URL}?mes=${mes}&ano=${ano}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao buscar dashboard");

  return res.json();
}

export async function getFaturamentoAno(
  ano: number,
): Promise<FaturamentoMensal[]> {
  const res = await fetch(`${DASHBOARD_URL}/faturamento?ano=${ano}`, {
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Erro ao buscar faturamento");

  return res.json();
}

export async function getUsuarios(): Promise<Usuario[]> {
  const res = await fetch(USUARIOS_URL, { headers: await authHeaders() });
  if (!res.ok) throw new Error("Erro ao buscar usuários");
  return res.json();
}

export async function createUsuario(email: string, password: string): Promise<void> {
  const res = await fetch(USUARIOS_URL, {
    method: "POST",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Erro ao criar usuário");
  }
}

export async function deleteUsuario(id: string): Promise<void> {
  const res = await fetch(`${USUARIOS_URL}/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Erro ao excluir usuário");
  }
}