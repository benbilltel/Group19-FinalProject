function showToast(message, isSuccess,callback) {
    var toastClass = isSuccess ? 'toasts-success' : 'toasts-fail';
    var toastElement = document.createElement('div');
    toastElement.classList.add('toasts', toastClass);
    toastElement.innerHTML = '<i class="fa-regular fa-circle-' + (isSuccess ? 'check' : 'xmark') + ' pe-2"></i>' +
      '<p class="toasts-text">' + message + '</p>';
  toastElement.classList.add("d-flex","justify-content-start","align-items-center")
    document.body.appendChild(toastElement);
  
    setTimeout(function () {
      toastElement.classList.add('show');
    }, 100);
  
    setTimeout(function () {
      toastElement.remove();
      if (typeof callback === 'function') {
        callback(); 
      }
    }, 1000);
  }