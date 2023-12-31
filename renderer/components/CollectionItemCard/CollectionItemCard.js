import App from '../App/App.js'
import TagsList from '../TagsList/TagsList.js'
import { get_ui_ready_date } from '../../utilities/ui_datetime.js'
import { create_section,create_div,create_h } from '../../utilities/ui_elements.js'



class CollectionItemCard {

   #props

   constructor(props) {
      this.#props = props
   }

   render = (fields,item) => {
      
      // 'fields' is an array including keys of properties in the 'item' and preserves the display order
      let card = create_section({
         classlist:['CollectionItemCard']
      })
      
      let field_element
      let tags_list_elem
 
      fields.forEach((field) => {

         let field_value = item[field.key]
         if(field.test.type === 'date') {
            field_value = get_ui_ready_date(field_value)
         }

         if(field.key === 'title') {

            if(field_value === '') field_value = 'no title'

            field_element = create_h({
               level:'h3',
               attributes: [
                  {key:'data-id',value:item.id}
               ],
               classlist:['text_blue','card_title_link','m_0','font_w_400','cursor_pointer','hover_line'],
               text:field_value
            })
            card.append(field_element)

         }
         else if(field.key === 'file_name') {

            let file_name_block = create_div({
               classlist:['flex','gap_.5']
            })

            field_element = create_div({
               text:field_value
            })

            let icon = document.createElementNS('http://www.w3.org/2000/svg','svg')
            
            icon.classList.add('pt_.5')
            const icon_path = document.createElementNS('http://www.w3.org/2000/svg','path')
            icon.setAttribute('width','16')
            icon.setAttribute('height','16')               
            icon_path.setAttribute('d','M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1')
            icon.appendChild(icon_path)
            file_name_block.append(icon,field_element)
            card.append(file_name_block)

         }

            // currently, we won't show tags on result's cards   to do : remove this once confirmed.
            // to do : if we do add 'tags' to card - let's keep it v. low key. (so as not to expect click works!)
            //         consider, we can search but don't see the search_term in results cards..

            // else if(field.key === 'tags') {

            //    tags_list_elem = create_div({
            //       attributes:[
            //          {key:'id',value:'tags_list_elem'}
            //       ],
            //       classlist:['m_0']
            //    }) 
            //    const tags_list = new TagsList()
            //    if(tags_list) {
            //       console.log('field_value',field_value)
            //       tags_list_elem.append(tags_list.render(item.id,field_value))
            //       tags_list.activate()
            //    }
            //    card.append(tags_list_elem)

            // }

         else {
            field_element = create_div({
               text:field_value
            })
            card.append(field_element)
         }
      })

      return card
   }

   // enable buttons/links displayed in the render
   activate = async() => {

      // Card Title link to record
         
      const card_title_links = document.querySelectorAll('.card_title_link')
   
      if(card_title_links) {
   
         card_title_links.forEach((card_title_link) => {

            card_title_link.addEventListener('click', async(event) => {
               
               if(typeof card_title_link.attributes['data-id'] !== 'undefined') {

                  const sep = await window.files_api.filePathSep()

                     try {
                        const collection_item_obj = await window.collection_items_api.getCollectionItem(card_title_link.attributes['data-id'].value)

                        if (typeof collection_item_obj != "undefined") {
                           if(collection_item_obj.outcome === 'success') {

                              let component_container = document.getElementById('component_container')
                              if(component_container) {

                                 // get search context to inject scroll_y
                                 let context = this.#props.context ? this.#props.context : null

                                 let props = {
                                    fields:collection_item_obj.collection_item_fields,
                                    item:collection_item_obj.collection_item,
                                    context:context ? {...context,scroll_y:window.scrollY} : null
                                 }
                                 App.switch_to_component('Record',props)
                              }
                           }
                           else {
                              throw 'No records were returned.'
                           }
                        }
                        else {
                           throw 'No records were returned.'
                        }
                     }
                     catch(error) {
                        let props = {
                           msg:'Sorry, we were unable to access the Records',
                           error:error
                        }
                        App.switch_to_component('Error',props)
                     }
                  }
                  else {
                     let props = {
                        msg:'Sorry, no valid id was provided for the Collection Item.',
                        error:error
                     }
                     App.switch_to_component('Error',props)
                  }
            })
         })
      }
   }



}



export default CollectionItemCard