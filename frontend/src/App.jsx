import logo from './assets/logo.png'

function App() {
  return (
    <div className="min-h-screen bg-base-950 text-ink flex flex-col items-center justify-center gap-4">
      <img src={logo} alt="SIGMA" className="w-24 h-24" />
      <h1 className="font-display font-bold text-4xl">
        SIGMA <span className="text-brand">funcionando</span>
      </h1>
    </div>
  )
}

export default App