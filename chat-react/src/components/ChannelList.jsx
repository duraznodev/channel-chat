import Channel from './Channel'

export default function ChannelList({channels}) {
  return (
    <div className="flex-1 space-y-4 overflow-y-scroll p-6">
      {channels.map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ))}
    </div>
  )
}
