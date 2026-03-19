import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Benefits from './components/Benefits'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import About from './components/About'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Services />
        <Benefits />
        <Process />
        <Testimonials />
        <About />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
