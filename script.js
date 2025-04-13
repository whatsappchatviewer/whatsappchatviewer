document.getElementById('chatFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const lines = content.split('\n');
    let output = "";

    lines.forEach(line => {
      const match = line.match(/^(\[?\d{1,2}\/\d{1,2}\/\d{2,4}, \d{1,2}:\d{2}(?: [APap][Mm])?\]?) (.*?): (.*)$/);
      if (match) {
        const [_, date, sender, message] = match;
        output += `<strong>${sender}</strong> <em>(${date})</em>: ${message}<br>`;
      } else {
        output += `${line}<br>`;
      }
    });

    document.getElementById('chatContainer').innerHTML = output;
  };

  reader.readAsText(file);
});
