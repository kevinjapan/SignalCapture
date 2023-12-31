import App from '../App/App.js'
import { create_section,create_h,create_button,create_div } from '../../utilities/ui_elements.js'
import { is_image_file, build_img_elem } from '../../utilities/ui_utilities.js'



// User clicks on img in CollectionItemRecord to view the image larger size


class ImageViewer {

   #props

   // moving zoomed img w/ mouse
   #start_x = 0
   #start_y = 0
   #scroll_top = 0
   #scroll_left = 0

   constructor(props) {
      this.#props = props
   }

   render = async() => {

      let viewer = create_section({
         classlist:['']
      })

      // ctrls
      let img_btn_group = create_div({
         classlist:['img_btn_group','flex','flex_col']
      })
      let x_btn = create_button({
         attributes:[
            {key:'id',value:'x_btn'}
         ],
         classlist:['x_btn'],
         text:'x'
      })
      let zoom_in_btn = create_button({
         attributes:[
            {key:'id',value:'zoom_in_btn'}
         ],
         classlist:['x_btn'],
         text:'+'
      })
      let zoom_out_btn = create_button({
         attributes:[
            {key:'id',value:'zoom_out_btn'}
         ],
         classlist:['x_btn'],
         text:'-'
      })

      img_btn_group.append(x_btn,zoom_in_btn,zoom_out_btn)

      const wrapper = create_div({
         classlist:['']
      })

      if(await is_image_file(this.#props.item['parent_folder_path'],this.#props.item['file_name'])) {   

         let attributes = [
            {key:'draggable',value:false}
         ]

         let img = await build_img_elem('record_img',this.#props.item['parent_folder_path'],this.#props.item['file_name'],attributes)
         if(img) {
            wrapper.append(img_btn_group,img)
         }
      }
      else {
         viewer.append(create_div(),document.createTextNode('No image file was found.'))
      }

      // assemble
      viewer.append(wrapper)
      return viewer
   }

   

   // enable buttons/links displayed in the render
   activate = () => {


      // Close image view

      const x_btn = document.getElementById('x_btn')
      if(x_btn) {
         x_btn.addEventListener('click',async(event) => {
            event.preventDefault()
            App.switch_to_component('Record',this.#props)
         })
      }

   
      // Zoom

      const zoom_in_btn = document.getElementById('zoom_in_btn')
      if(zoom_in_btn) {
         zoom_in_btn.addEventListener('click',async(event) => {
            event.preventDefault()
            const record_img = document.getElementById('record_img')
            if(record_img) {
               record_img.style.minWidth = '200%'
            }

         })
      }
      const zoom_out_btn = document.getElementById('zoom_out_btn')
      if(zoom_out_btn) {
         zoom_out_btn.addEventListener('click',async(event) => {
            event.preventDefault()
            const record_img = document.getElementById('record_img')
            if(record_img) {
               record_img.style.minWidth = '100%'
            }

         })        
      }

      
      // Click and move zoomed img
      // future : change to 'move' cursor while moving - it's a bit flakey (can't both show 'move' and return to 'pointer')

      document.addEventListener('mousedown',(event) => {
         event.preventDefault()
         document.addEventListener('mousemove',this.on_mouse_move)
         this.#start_x = event.clientX
         this.#start_y = event.clientY
         this.#scroll_top = document.documentElement.scrollTop
         this.#scroll_left = document.documentElement.scrollLeft
      })
      document.addEventListener('mouseup',(event) => {
         event.preventDefault()
         document.removeEventListener('mousemove',this.on_mouse_move)
      })

   }


   on_mouse_move = (event) => {
      event.preventDefault()
      window.scrollTo({
         left: this.#scroll_left + (this.#start_x - event.clientX),
         top: this.#scroll_top + (this.#start_y - event.clientY)
      })
   }

}


export default ImageViewer