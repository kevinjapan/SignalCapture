

const MIN_SEARCH_TERM_LEN = 3       // future : packagethis w/ similar in Search object / enum



const get_status_condition = (record_status) => {

   switch(record_status) {
      case 'all_records':
         return ''
      case 'deleted_records':
         return `collection_items.deleted_at IS NOT NULL`
      default:
         return 'collection_items.deleted_at IS NULL'
   }
}


const tokenize_search_term = (full_search_term) => {

   let tokens = []
   if(full_search_term.indexOf(' ') === -1) {
      tokens.push(full_search_term)
   }
   else {
      tokens = [full_search_term,...full_search_term.split(' ')]
   }
   return [...tokens.filter(token => token.length >= MIN_SEARCH_TERM_LEN) ]
}


const remove_stopwords = (search_term_tokens) => {
   // exlude common words from our searches
   let tokens = null
   if(search_term_tokens.length > 1) {
      tokens = search_term_tokens.filter(token => {
         return !search_excluded_words.includes(token)
      })
   }
   else {
      tokens = search_term_tokens
   }
   return tokens
}


// stopword list
const search_excluded_words = [
   'also','and','are','been','but','for','from',
   'has','have','not','our',
   'than','that','the','their','them','then','there','these','this',
   'was','were','with',
]
//
// 2-char words we exclude from above since our search sets min 3-char search_terms
// 'an','as','at','be','by','if','in','is','of','on','or','so','to','we',
//
// unlikely stopwords we exclude from above since we don't expect any frequent issue
// 'because','however','whatever',whether','which','would'
//


module.exports = {
   MIN_SEARCH_TERM_LEN,
   get_status_condition,
   tokenize_search_term,
   remove_stopwords,
}