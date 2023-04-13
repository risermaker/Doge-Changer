let logoChanged = false;

function changeTwitterLogo() {
  if (logoChanged) return;
  console.log('changeTwitterLogo called'); // Debug message
  const newLogoUrl = chrome.runtime.getURL('new_logo.png');
  console.log('newLogoUrl:', newLogoUrl);
  const headerElement = document.querySelector('header[role="banner"]');
  const logoElement = headerElement?.querySelector('svg');

  if (logoElement) {
    console.log('logoElement found'); // Debug message
    const logoParent = logoElement.parentElement;

    if (logoParent) {
      const newLogo = new Image();
      newLogo.src = newLogoUrl + '?' + new Date().getTime();
      newLogo.style.width = '36px'; // Adjust the width to match your new logo
      newLogo.style.height = '36px'; // Adjust the height to match your new logo
      logoParent.replaceChild(newLogo, logoElement);
      console.log('Logo replaced'); // Debug message
    } else {
      console.log('Logo parent not found'); // Debug message
    }
  } else {
    console.log('Logo element not found'); // Debug message
  }
  logoChanged = true;
}

function observeDOMChanges() {
  const headerElement = document.querySelector('header[role="banner"]');

  if (!headerElement) {
    setTimeout(observeDOMChanges, 1000); // Retry in 1 second if the header element is not found
    return;
  }

  changeTwitterLogo(); // Call changeTwitterLogo immediately when the header element is found

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        const logoElement = headerElement.querySelector('svg');
        if (logoElement) {
          changeTwitterLogo();
          observer.disconnect(); // Disconnect the observer once the logo is changed
          break;
        }
      }
    }
  });

  // Start observing the header element for changes in its child elements
  observer.observe(headerElement, { childList: true, subtree: true });
}

// Call the observeDOMChanges function to wait for the logo element to be available in the DOM
observeDOMChanges();
