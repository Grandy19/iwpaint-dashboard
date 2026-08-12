import re

filepath = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\customerController.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement_having = """    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      
      sql += " HAVING area IN (?)";
      params.push(matchedAreas);
    }"""

content = content.replace("""    if (area && area !== "Semua Area") {
      sql += " HAVING area = ?";
      params.push(area);
    }""", replacement_having)


replacement_where = """    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];

      sql += " AND (u.area IN (?) OR f.nama_gudang IN (?))";
      params.push(matchedAreas, matchedAreas);
    }"""

content = content.replace("""    if (area && area !== "Semua Area") {
      sql += " AND (u.area = ? OR f.nama_gudang = ?)";
      params.push(area, area);
    }""", replacement_where)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated customerController.js")
