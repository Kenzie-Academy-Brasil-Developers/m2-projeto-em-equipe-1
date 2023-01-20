
export function toast( text, color ) {
  Toastify( {
    text: text,
    duration: 1700,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      background: color,
      'border-radius': '16px 0 0 16px',
    }
  } ).showToast()
}
