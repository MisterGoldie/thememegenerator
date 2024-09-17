/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const NEYNAR_API_KEY = '71332A9D-240D-41E0-8644-31BD70E64036' // Replace with your actual Neynar API key

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'memegenerator2',
})

interface NeynarReaction {
  reaction_type: string;
  // Add other properties if needed
}

interface NeynarResponse {
  reactions: NeynarReaction[];
  // Add other properties if needed
}

async function checkLikeAndRecast(fid: string, castHash: string): Promise<boolean> {
  const url = `https://api.neynar.com/v2/farcaster/reactions?fid=${fid}&cast_hash=${castHash}&reaction_type=like,recast`
  const options = {
    method: 'GET',
    headers: { accept: 'application/json', api_key: NEYNAR_API_KEY }
  }

  try {
    const response = await fetch(url, options)
    const json = await response.json() as NeynarResponse
    const reactions = json.reactions || []
    const hasLiked = reactions.some(r => r.reaction_type === 'like')
    const hasRecast = reactions.some(r => r.reaction_type === 'recast')
    return hasLiked && hasRecast
  } catch (err) {
    console.error('Error checking like and recast:', err)
    return false
  }
}

app.frame('/', (c) => {
  return c.res({
    image: "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmQu3WSN8JE1cgjpUY7fVy3nRtfzWRyPU5TLvusdf92PT4",
    intents: [
      <Button action="/check-interaction" value="A">A</Button>,
      <Button action="/check-interaction" value="B">B</Button>,
    ],
  })
})

app.frame('/check-interaction', async (c) => {
  const { buttonValue } = c
  const fid = c.frameData?.fid
  const castHash = c.frameData?.castId?.hash

  if (!fid || !castHash) {
    return c.res({
      image: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#1DA1F2' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '20px', color: 'white' }}>Error: Missing FID or Cast Hash</h1>
        </div>
      ),
      intents: [
        <Button action="/">Back</Button>
      ]
    })
  }

  const hasLikedAndRecast = await checkLikeAndRecast(fid.toString(), castHash)

  if (!hasLikedAndRecast) {
    return c.res({
      image: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#1DA1F2' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '20px', color: 'white' }}>Please like and recast to continue</h1>
        </div>
      ),
      intents: [
        <Button action="/check-interaction" value={buttonValue}>Check again</Button>
      ]
    })
  }

  return c.res({
    image: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#1DA1F2' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px', color: 'white' }}>Thank you! Click to continue</h1>
      </div>
    ),
    intents: [
      <Button action="/picker" value={buttonValue}>Continue</Button>
    ]
  })
})

app.frame('/picker', (c) => {
  const { buttonValue } = c
  const imageA = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmVxD55EV753EqPwgsaLWq4635sT6UR1M1ft2vhL3GZpeV"
  const imageB = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmcBQuKTWvRHuWgLt4sSdTrCCYVeY47v1maaWhMynne7Gt"

  const image = buttonValue === 'A' ? imageA : imageB

  return c.res({
    image: image,
    imageAspectRatio: '1:1',
    intents: [
      <TextInput placeholder="Enter text..." />,
      <Button action="/">Back</Button>,
      <Button action="/generate" value={buttonValue}>Generate</Button>,
    ],
  })
})

app.frame('/generate', (c) => {
  const { buttonValue, inputText } = c
  const imageA = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmVxD55EV753EqPwgsaLWq4635sT6UR1M1ft2vhL3GZpeV"
  const imageB = "https://amaranth-adequate-condor-278.mypinata.cloud/ipfs/QmcBQuKTWvRHuWgLt4sSdTrCCYVeY47v1maaWhMynne7Gt"

  const originalFramesLink = 'https://thememegenerator.vercel.app/api' // Replace with your actual Frames link

  const farcasterShareURL = `https://warpcast.com/~/compose?text=Check%20out%20this%20meme%20generator%20and%20make%20sure%20to%20follow%20@goldie%20on%20Farcaster!&embeds[]=${encodeURIComponent(originalFramesLink)}`

  const image = buttonValue === 'A' ? imageA : imageB

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
      <Button.Link href={farcasterShareURL}>Share</Button.Link>,
      <Button action="/">Restart</Button>
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)