import App from '../App/App.js'
import RecordBtns from '../RecordBtns/RecordBtns.js'
import RecordAdmin from '../RecordAdmin/RecordAdmin.js'
import { ui_friendly_text } from '../../utilities/ui_strings.js'
import { is_image_file, build_img_elem } from '../../utilities/ui_utilities.js'
import { create_section,create_div,create_p,create_button } from '../../utilities/ui_elements.js'




class CollectionItemRecord {

   // props.context, props.fields, props.item
   // 'fields' is an array of names of properties in the 'item' and preserves the display order
   #props

   #record

   constructor(props) {
      this.#props = props
   }

   render = () => {


      // component container
      this.#record = create_section({
         classlist:['collection_item_record']
      })

      // 2-col layout
      let text_col = create_div({
         classlist:['text_col']
      })

      let img_col = create_div({
         classlist:['img_col']
      })

      let img_view = create_div({
         attributes:[
            {key:'id',value:'img_view'}
         ],
         classlist:['img_view']
      })

      if(this.#props.item['deleted_at']) {
         const notify_deleted = create_p({
            classlist:['bg_yellow_100','grid_span_2'],
            text:'This record has previously been deleted and will soon be permanently auto-deleted from the system.'
         })
         this.#record.append(notify_deleted)
      }

      // 'form' layout inside text_col
      let form_layout = create_div({
         attributes:[
            {key:'id',value:'item_form'}
         ],
         classlist:['form_layout']
      })
      text_col.append(form_layout)

      form_layout.append(RecordBtns.render(this.#props.item.id,this.#props.context ? true : false))

      let field_label
      let field_value

      
      // append form element for each Record field
      this.#props.fields.forEach( async (field) => { 

         field_label = create_div({
            classlist:['label'],
            text:ui_friendly_text(field.key)
         })
   
         field_value = create_div({
            text:this.#props.item[field.key]
         })
            
         form_layout.append(field_label,field_value)

         // display file if file_name is recognized image type
         if(field.key === 'file_name') {

            if(await is_image_file(this.#props.item['parent_folder_path'],this.#props.item[field.key])) {   

               let img = await build_img_elem('record_img',this.#props.item['parent_folder_path'],this.#props.item[field.key])
               if(img) {
                  img_col.append(img)
               }
            }
            else {
               img_col.append(create_div(),document.createTextNode('No image file was found.'))
            }
         }
      })

      form_layout.append(RecordBtns.render(this.#props.item.id,this.#props.context ? true : false))

      const record_admin = new RecordAdmin(this.#props)
      setTimeout(() => record_admin.activate(),300)

      // assemble
      img_col.append(img_view)
      this.#record.append(text_col,img_col,img_view,record_admin.render())

      if(this.#props.item['deleted_at']) {
         const notify_deleted = create_p({
            classlist:['bg_yellow_100','grid_span_2'],
            text:'This record has previously been deleted and will soon be permanently auto-deleted from the system.'
         })
         this.#record.append(notify_deleted)
      }
   
      window.scroll(0,0)

      return this.#record
   }


   // enable buttons/links displayed in the render
   activate = () => {

      const edit_buttons = document.querySelectorAll('.edit_button')

      if(edit_buttons) {
         edit_buttons.forEach((edit_button) => {
            edit_button.addEventListener('click',async(event) => {
   
               try {
                  const collection_item_obj = await window.collection_items_api.getCollectionItem(edit_button.attributes['data-id'].value)
      
                  if (typeof collection_item_obj != "undefined") {
      
                     if(collection_item_obj.outcome === 'success') {
      
                        // display single CollectionItem for editing in CollectionItemForm
                        
                        this.#props = {
                           fields:collection_item_obj.collection_item_fields,
                           item:collection_item_obj.collection_item,
                           context:this.#props.context ? this.#props.context : null
                        }
                        App.switch_to_component('Form',this.#props)
                     } 
                     else {
                        let props = {
                           msg:'Sorry, we were unable to locate the Record.',
                           error:error
                        }
                        App.switch_to_component('Error',props)
                     }
                  }
                  else {
                     let props = {
                        msg:'Sorry, we were unable to locate the Record.',
                        error:error
                     }
                     App.switch_to_component('Error',props)
                  }
               }
               catch(error) {
                  let props = {
                     msg:'Sorry, we were unable to locate the Record.',
                     error:error
                  }
                  App.switch_to_component('Error',props)
               }
            })
         })
      }


      // open file's folder
      let open_folder_btn = document.getElementById('open_folder_btn')
      if(open_folder_btn) {
         open_folder_btn.addEventListener('click',() => {
            window.files_api.openFolder(this.#props.item.parent_folder_path)
         })
      }



      // view larger image size
      let record_img = document.getElementById('record_img')
      if(record_img) {
         record_img.addEventListener('click',() => {
            // we pass 'props.context' as a token for on returning to this Record
            App.switch_to_component('ImageViewer',this.#props)
         })
      }

      let back_btns = document.querySelectorAll('.back_btn')
      if(back_btns){
         back_btns.forEach(back_btn => {

            back_btn.addEventListener('click',async(event) => {
               // the context token identifies the current user context inc. component

               if(this.#props.context) {
                  App.switch_to_component(this.#props.context.key,this.#props)
               }             
            })
         })
      }
   }
}


export default CollectionItemRecord