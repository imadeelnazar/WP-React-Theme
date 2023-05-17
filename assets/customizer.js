(function ($) {
  // Handle postMessage transport method
  wp.customize("ultimate_subheader_BG", function (value) {
    value.bind(function (newVal) {
      // Trigger an event to communicate with the React component
      $(document).trigger("customizerUpdate", newVal);
    });
  });

  // Listen for customizerUpdate event and update React component's state
  $(document).on("customizerUpdate", function (event, newVal) {
    // Update the React component's state with the new value
    // or trigger a function to handle the update
    // For example, if you have a React component called MyComponent:
    // MyComponent.setState({ ultimate_subheader_BG: newVal });
  });
})(jQuery);