export default function useShortcut() {
  function onSearch(callback: Function) {
    document.addEventListener('keydown', (event) => {
      // Check if Ctrl or Cmd key is pressed along with the 'P' key
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault()
        callback()
      }
    })
  }

  function destroy() {
    document.removeEventListener('keydown', () => {})
  }

  return { onSearch, destroy }
}
