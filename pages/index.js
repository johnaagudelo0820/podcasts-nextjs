export default class extends React.Component {
  render() {
    return <>
      <h1>¡Hola mundo!</h1>
      <p>Bienvenido al curso de Next.js</p>
      <img src="/platzi-logo.png" alt="logo platzi" />

      <style jsx>{`
        h1{
          color: red;
        }
        p {
          color: green;
        }
        img {
          max-width: 20%;
          display: block;
          margin: 0 auto;
        }
      `}</style>

      <style jsx global>{`
        body {
          background: yellow;
          color: red;
        }
      `}</style>
    </>
  }
}