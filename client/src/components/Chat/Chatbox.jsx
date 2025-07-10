import React from 'react'

const Chatbox = () => {
  return (
    <section className='h-[70vh] w-[400px] rounded-lg shadow-md overflow-hidden bg-amber-500'>
      {/* Chatbox content goes here */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Chat</h2>
        <div className="h-[50vh] overflow-y-auto mb-4 bg-white rounded p-2">
          {/* Messages will go here */}bbbbbbbb
        </div>
        <div className="flex">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 p-2 border rounded-l"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Send
          </button>
        </div>
      </div>
    </section>
  )
}

export default Chatbox








