document.getElementById('chatFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.name.endsWith('.zip')) {
    // Handle zip file
    const zip = new JSZip();
    zip.loadAsync(file).then(function(contents) {
      let found = false;
      contents.forEach((relativePath, zipEntry) => {
        if (zipEntry.name.endsWith('.txt') && !found) {
          found = true;
          zipEntry.async("string").then(function(text) {
            parseChat(text);
          });
        }
      });
    }).catch(err => {
      alert("Invalid zip file");
    });

  } else if (file.name.endsWith('.txt')) {
    // Handle txt file
    const reader = new FileReader();
    reader.onload = function(e) {
      parseChat(e.target.result);
    };
    reader.readAsText(file);
  } else {
    alert("Only .txt or .zip files supported.");
  }
});

function parseChat(content) {
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
}
