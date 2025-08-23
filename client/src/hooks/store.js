import {configureStore} from '@reduxjs/toolkit'
import themeReducer from './themeSlice.js';
import sidebarReducer from './sidebarSlice.js'
import blurReducer from './blurSlice.js';



export const store =configureStore({
    reducer:{
        theme: themeReducer,
        sidebar: sidebarReducer,
        blur: blurReducer,
   
    },

})
