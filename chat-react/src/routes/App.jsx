import {Outlet, redirect, useLoaderData} from 'react-router-dom'

import ChannelList from '../components/ChannelList'
import {AuthContext} from '../context/auth.context'
import ky from '../utils/ky'
import {useParams} from 'react-router-dom'
import clsx from 'clsx'

export async function loader() {
  try {
    const user = await ky.get('user').json()
    const channels = await ky.get('channels').json()

    return {
      user,
      channels: channels,
    }
  } catch (err) {
    if (err.response.status === 401) {
      return redirect('/login')
    }
  }
}

export default function App() {
  const {user, channels} = useLoaderData()
  const {channelId} = useParams()
  const actualChannelName = channels[channelId - 1]?.name

  function handleLogout() {
    localStorage.removeItem('token')

    window.location.reload()
  }

  return (
    <AuthContext.Provider value={user}>
      <div className="flex h-screen text-[#c5c5c9]">
        <div className="flex w-[300px] flex-col border border-[#4a4a4b] bg-[#19171D]">
          <h2 className="flex h-12 items-center justify-center border-b border-[#4a4a4b] text-xl font-semibold">
            Channels
          </h2>
          <ChannelList channels={channels} />
          <div className="">
            <div className="flex items-center gap-x-3 px-6 py-4">
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded font-bold',
                  `bg-${user.color}-900`
                )}
              >
                {user.name[0]}
              </div>
              <span
                className={clsx(
                  'font-bold tracking-wide',
                  `text-${user.color}-100`
                )}
              >
                {user.name}
              </span>
            </div>
            <button
              className="flex w-full  items-center justify-center border border-red-500 p-4 text-lg font-bold text-red-500"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-[#1A1D21] text-white">
          <h2 className="flex h-12 items-center justify-center border-b border-[#4a4a4b] text-xl font-semibold">
            {actualChannelName ?? 'Messages'}
          </h2>
          <Outlet />
        </div>
      </div>
    </AuthContext.Provider>
  )
}
