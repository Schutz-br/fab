import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PerfilProvider, usePerfil } from './PerfilContext.jsx'
import Sidebar from './components/Sidebar.jsx'

// Página -> perfis que podem abrir (igual ao RESTRITO do menu.js)
const RESTRITO = {
  '/pedidos': ['instrutor', 'administrador'],
  '/usuarios': ['administrador'],
  '/dashboard-aluno': ['aluno'],
  '/dashboard-instrutor': ['instrutor'],
  '/dashboard-administrador': ['administrador'],
}

// Rota protegida: sem perfil vai para o login, sem permissão vai para o 403
function RotaProtegida() {
  const { perfil } = usePerfil()
  const local = useLocation()

  if (!perfil) return <Navigate to="/login" replace />

  const permitidos = RESTRITO[local.pathname]
  if (permitidos && !permitidos.includes(perfil)) return <Navigate to="/403" replace />

  // Esqueleto das páginas internas: menu + tela da direita
  return (
    <div id="geral" className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-sans">
      <Sidebar />
      <Outlet />
    </div>
  )
}

// Provisório: tela vazia só para testar as rotas (troca pelas telas reais)
function EmBreve({ titulo }) {
  return (
    <div id="painelDireita" className="flex-1 h-screen overflow-y-auto p-8">
      <h2 className="text-2xl font-bold text-slate-900">{titulo}</h2>
      <p className="text-sm text-slate-600">Tela ainda não convertida.</p>
    </div>
  )
}

// Provisório: login com 3 botões para testar os perfis (troca pela tela de login)
function LoginTeste() {
  const { entrar } = usePerfil()
  const ir = useNavigate()

  function escolher(perfil) {
    entrar(perfil)
    ir('/dashboard-' + perfil)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
      <h2 className="text-2xl font-bold text-slate-900">Login (teste)</h2>
      <div className="flex gap-3">
        <button onClick={() => escolher('aluno')} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold cursor-pointer">Aluno</button>
        <button onClick={() => escolher('instrutor')} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold cursor-pointer">Instrutor</button>
        <button onClick={() => escolher('administrador')} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold cursor-pointer">Administrador</button>
      </div>
    </div>
  )
}

// Provisório: página de acesso negado
function Acesso403() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2 font-sans">
      <h2 className="text-2xl font-bold text-slate-900">403 - Acesso negado</h2>
      <p className="text-sm text-slate-600">Seu perfil não tem permissão para abrir esta página.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PerfilProvider>
        <Routes>

          {/* Páginas abertas */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginTeste />} />
          <Route path="/403" element={<Acesso403 />} />

          {/* Páginas internas (precisam de login) */}
          <Route element={<RotaProtegida />}>
            <Route path="/dashboard-aluno" element={<EmBreve titulo="Dashboard do aluno" />} />
            <Route path="/dashboard-instrutor" element={<EmBreve titulo="Dashboard do instrutor" />} />
            <Route path="/dashboard-administrador" element={<EmBreve titulo="Dashboard do administrador" />} />
            <Route path="/inventario" element={<EmBreve titulo="Inventário" />} />
            <Route path="/equipamentos" element={<EmBreve titulo="Equipamentos" />} />
            <Route path="/reservas" element={<EmBreve titulo="Reservas" />} />
            <Route path="/pedidos" element={<EmBreve titulo="Pedidos para análise" />} />
            <Route path="/notificacoes" element={<EmBreve titulo="Notificações" />} />
            <Route path="/usuarios" element={<EmBreve titulo="Usuários" />} />
          </Route>

          {/* Endereço que não existe volta para o login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </PerfilProvider>
    </BrowserRouter>
  )
}

export default App