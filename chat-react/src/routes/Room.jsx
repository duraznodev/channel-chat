import {useEffect, useRef} from 'react'
import {useLoaderData, useRevalidator} from 'react-router-dom'

import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import echo from '../utils/echo'
import ky from '../utils/ky'
import {useState} from 'react'
import {useUser} from '../context/auth.context'

export async function action(args) {
  const {params, request} = args
  const formData = await request.formData()
  await ky
    .post('messages', {
      json: {
        message: formData.get('message'),
        channel_id: params.channelId,
      },
    })
    .json()

  return {}
}

export async function loader({params}) {
  const messages = await ky.get(`messages/${params.channelId}`).json()

  return {
    messages,
  }
}

export default function Room() {
  const formRef = useRef(null)
  const listRef = useRef(null)
  const user = useUser()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const {messages} = useLoaderData()
  const revalidator = useRevalidator()

  function onScrollDown() {
    listRef.current.scrollTo(0, listRef.current.scrollHeight)

    setUnreadMessages(0)
  }

  useEffect(() => {
    const listener = listRef.current.addEventListener('scroll', function () {
      const isAtBottom =
        listRef.current.scrollTop ===
        listRef.current.scrollHeight - listRef.current.clientHeight
      if (isAtBottom) {
        setUnreadMessages(0)
      }
    })
    return () => listRef.current.removeEventListener('scroll', listener)
  }, [])

  useEffect(() => {
    const listener = echo
      .channel('messages')
      .listen('MessageCreated', function () {
        const isNotAtBottom =
          listRef.current.scrollTop !==
          listRef.current.scrollHeight - listRef.current.clientHeight
        if (isNotAtBottom) {
          setUnreadMessages(unreadMessages + 1)
        }
        revalidator.revalidate()
      })
    formRef.current.reset()
    return () => listener.stopListening('MessageCreated')
  }, [revalidator])

  return (
    <div className="relative m-4 flex flex-1 flex-col overflow-hidden">
      <MessageList messages={messages} ref={listRef} />
      <MessageForm ref={formRef} onScrollDown={onScrollDown} />
      {!!unreadMessages && (
        <button
          onClick={onScrollDown}
          className="absolute left-2/4 top-0 flex -translate-x-[50%] items-center gap-x-2 rounded-full bg-blue-400 px-2 py-1 text-sm font-bold text-white"
        >
          <span>
            <svg
              className="fill-white"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 384 512"
            >
              <path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7L86.6 329.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128z" />
            </svg>
          </span>
          <span>{unreadMessages} mensajes nuevos</span>
          <span>
            <svg
              className="fill-white"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 384 512"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
