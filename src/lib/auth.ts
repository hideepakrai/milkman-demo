type TokenPayload = Record<string, unknown>;

export async function signToken(_payload: TokenPayload) {
  return "demo-token";
}

export async function verifyToken(_token: string) {
  return {
    id: "67c7e6884391e452a2656910",
    phone: "8888888888",
    role: "ADMIN",
    name: "",
  };
}

export async function getCurrentUser(role?: "ADMIN" | "CUSTOMER") {
  return {
    id: "67c7e6884391e452a2656910",
    phone: "8888888888",
    role: role || "ADMIN",
    name: "",
  };
}
