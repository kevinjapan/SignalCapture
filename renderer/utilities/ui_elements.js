//
// we retain separate funcs for each element for readability in client code 
// (rather than passing in element tag as argument to a single function as we do here)
//
// use: 
//
// let apply_btn = create_button({
//    attributes:[
//       {key:id,value:'ci_apply_button'},
//       {key:'data-id',value:item.id}
//    ],
//    classlist:['bg_lightgrey','border'],
//    text:'Apply'
// })
//

export const create_section = (props) => {
   return create_element('section',props)
}
export const create_form = (props) => {
   return create_element('form',props)
}
export const create_label = (props) => {
   return create_element('label',props)
}   
export const create_input = (props) => {
   return create_element('input',props)
}
export const create_textarea = (props) => {
   return create_element('textarea',props)
}
export const create_button = (props) => {
   return create_element('button',props)
}
export const create_div = (props) => {
   return create_element('div',props)
}
export const create_img = (props) => {
   return create_element('img',props)
}
export const create_paragraph = (props) => {
   return create_element('p',props)
}
export const create_ul = (props) => {
   return create_element('ul',props)
}
export const create_li = (props) => {
   return create_element('li',props)
}

// Heading
// additional prop - level:'h1'
export const create_heading = (props) => {
   let valid_headings = ['h1','h2','h3','h4','h5','h6']   
   let heading_elem
   if(typeof props.level !== undefined) {
      if(valid_headings.some((valid_heading) => {
         return props.level === valid_heading
      })) {
         heading_elem = document.createElement(props.level)
      }
      else {
         heading_elem = 'h3'
      }
      hydrate_element(heading_elem,props)
      return heading_elem
   }
   return null
}

// create the dom element
const create_element = (tag,props) => {
   let elem = document.createElement(tag)
   if(props) hydrate_element(elem,props)
   return elem
}

// hydrate the element with the given props - attributes/class/text
const hydrate_element = (elem,props) => {
   if(props) {
      if(typeof props.attributes !== 'undefined') {
         props.attributes.forEach((attr) => {
            if(attr.value) {    
               elem.setAttribute(attr.key,attr.value) 
            }     
         })
      }
      if(typeof props.classlist !== 'undefined') {
         props.classlist.forEach((class_name) => {
            if(class_name && class_name !== '') {
               elem.classList.add(class_name)
            }
         })
      }
      if(typeof props.text !== 'undefined') {
         elem.append(document.createTextNode(props.text))
      }
   }
}