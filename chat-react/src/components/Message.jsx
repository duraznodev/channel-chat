import clsx from 'clsx'

import {useUser} from '../context/auth.context'

export default function Message({message}) {
  const sender = message.sender
  const user = useUser()
  const isAuthUser = sender.id === user.id

  return (
    <div
      className={clsx('flex items-end space-x-2', {
        'self-end': isAuthUser,
      })}
    >
      {!isAuthUser && (
        <div
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded font-bold',
            `bg-${message.sender.color}-900`
          )}
        >
          {message.sender.name[0]}
        </div>
      )}
      <div
        className={clsx(
          'rounded-md px-4 py-2 font-medium text-black',
          `bg-${message.sender.color}-200`,
          {
            'rounded-bl-none ': !isAuthUser,
            'rounded-br-none': isAuthUser,
          }
        )}
      >
        {message.message}
      </div>
    </div>
  )
}
