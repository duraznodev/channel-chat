import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export default new Echo({
  broadcaster: 'pusher',
  key: '5f25d928153891496072',
  cluster: 'us2',
  forceTLS: true,
})
