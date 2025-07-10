import React from 'react'

const Chatbox = () => {
  return (
    <>
    <section className='h-[70vh] w-[400px] rounded-lg shadow-md   overflow-hidden bg-amber-500'>
      {/* Chatbox content goes here */}
      <div className="p-4">
        <div className='flex items-center mb-4'>
          <h2 className="text-xl font-bold ">Comments</h2>
        <p>how many comments</p>
        </div>
        {/* Messages will go here */}
        <textarea text="default"  className="h-[50vh] border-0 outline-0 w-full flex flex-wrap overflow-y-auto mb-4 bg-white rounded p-2 resize-none"/>
          
        
        <div className="flex">
          <div class="w-10 h-10 bg-red-800 text-amber-50 flex items-center justify-center rounded-full">BE</div>

          {/* <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 p-2 border rounded-l"
          /> */}
          
        </div>
        {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Send
          </button> */}
      </div>
    </section>
    </>
  )
}

export default Chatbox








