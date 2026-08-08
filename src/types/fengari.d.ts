// fengari não publica tipos TypeScript próprios. O motor (src/lua/engine/runner.ts)
// usa só um subconjunto pequeno e estável da API C do Lua exposta por essa lib,
// então declaramos aqui apenas o necessário, com `unknown` no lugar de `lua_State*`.
declare module 'fengari' {
  export const lua: {
    LUA_OK: number;
    LUA_TNIL: number;
    LUA_TBOOLEAN: number;
    LUA_TNUMBER: number;
    LUA_TSTRING: number;
    LUA_TTABLE: number;
    LUA_MASKCOUNT: number;
    lua_gettop(L: unknown): number;
    lua_pop(L: unknown, n: number): void;
    lua_pushjsfunction(L: unknown, fn: (L: unknown) => number): void;
    lua_setglobal(L: unknown, name: Uint8Array): void;
    lua_getglobal(L: unknown, name: Uint8Array): void;
    lua_isfunction(L: unknown, idx: number): boolean;
    lua_pcall(L: unknown, nargs: number, nresults: number, msgh: number): number;
    lua_pushnil(L: unknown): void;
    lua_pushnumber(L: unknown, n: number): void;
    lua_pushboolean(L: unknown, b: boolean): void;
    lua_pushstring(L: unknown, s: Uint8Array): void;
    lua_createtable(L: unknown, narr: number, nrec: number): void;
    lua_rawseti(L: unknown, idx: number, n: number): void;
    lua_rawgeti(L: unknown, idx: number, n: number): void;
    lua_rawlen(L: unknown, idx: number): number;
    lua_absindex(L: unknown, idx: number): number;
    lua_type(L: unknown, idx: number): number;
    lua_toboolean(L: unknown, idx: number): boolean;
    lua_tonumber(L: unknown, idx: number): number;
    lua_tostring(L: unknown, idx: number): Uint8Array;
    lua_sethook(L: unknown, fn: (L: unknown) => void, mask: number, count: number): void;
  };
  export const lauxlib: {
    luaL_newstate(): unknown;
    luaL_error(L: unknown, msg: Uint8Array): void;
    luaL_dostring(L: unknown, s: Uint8Array): number;
    luaL_tolstring(L: unknown, idx: number): Uint8Array;
  };
  export const lualib: {
    luaL_openlibs(L: unknown): void;
  };
  export function to_luastring(s: string): Uint8Array;
  export function to_jsstring(s: Uint8Array): string;
}
