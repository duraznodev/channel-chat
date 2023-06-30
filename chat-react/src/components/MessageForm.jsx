import {forwardRef} from 'react'
import {Form, useParams} from 'react-router-dom'

const MessageForm = forwardRef(function MessageForm({onScrollDown}, ref) {
  const params = useParams()

  return (
    <Form
      onSubmit={() => {
        setTimeout(onScrollDown, 1500) //Si, esto es un hack muy feo
      }}
      action={`/channels/${params.channelId}`}
      className="mt-4 rounded-md border border-[#404852] bg-[#323841] p-2 "
      method="post"
      ref={ref}
    >
      <input
        autoFocus
        className="block w-full bg-transparent px-4 py-2"
        name="message"
        placeholder="Message..."
        type="text"
      />
    </Form>
  )
})

export default MessageForm
