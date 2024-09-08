/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'memegenerator2',
})

app.frame('/', (c) => {
  return c.res({
    image: "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmQu3WSN8JE1cgjpUY7fVy3nRtfzWRyPU5TLvusdf92PT4",
    intents: [
      <Button action="/picker" value="A">A</Button>,
      <Button action="/picker" value="B">B</Button>,
    ],
  })
})

app.frame('/picker', (c) => {
  const { buttonValue } = c;
  const imageA = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmVxD55EV753EqPwgsaLWq4635sT6UR1M1ft2vhL3GZpeV";
  const imageB = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmcBQuKTWvRHuWgLt4sSdTrCCYVeY47v1maaWhMynne7Gt";

  const image = buttonValue === 'A' ? imageA : imageB;

  return c.res({
    image: image,
    imageAspectRatio: '1:1',
    intents: [
      <TextInput placeholder="Enter text..." />,
      <Button action="/">Back</Button>,
      <Button action="/generate" value={buttonValue}>Generate</Button>,
    ],
  });
})

app.frame('/generate', (c) => {
  const { buttonValue, inputText } = c;
  const imageA = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmVxD55EV753EqPwgsaLWq4635sT6UR1M1ft2vhL3GZpeV";
  const imageB = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmcBQuKTWvRHuWgLt4sSdTrCCYVeY47v1maaWhMynne7Gt";

  const image = buttonValue === 'A' ? imageA : imageB;

  return c.res({
    image: (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        <img 
          src={image}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}>
          <div style={{
            color: 'white',
            fontSize: '60px',
            fontWeight: 'bold',
            fontFamily: 'Arial, Helvetica, sans-serif',
            textAlign: 'center',
            maxWidth: '90%',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)',
          }}>
            {inputText}
          </div>
        </div>
      </div>
    ),
    imageAspectRatio: '1:1',
    intents: [
      <Button action="/">Restart</Button>
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)