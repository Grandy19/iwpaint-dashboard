import re

filepath = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\targetController.js"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement1 = """    } else if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") {
        matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      } else if (area === "DKI Jakarta") {
        matchedAreas = ["Jakarta"];
      } else if (area === "Jawa Tengah") {
        matchedAreas = ["Semarang"];
      } else if (area === "Jawa Timur") {
        matchedAreas = ["Surabaya"];
      } else if (area === "Sumatera") {
        matchedAreas = ["Medan"];
      }
      usersQuery += " AND area IN (?)";
      usersParams.push(matchedAreas);
    }"""

content = content.replace("""    } else if (area && area !== "Semua Area") {
      usersQuery += " AND area = ?";
      usersParams.push(area);
    }""", replacement1)


replacement2 = """    } else if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") {
        matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      } else if (area === "DKI Jakarta") {
        matchedAreas = ["Jakarta"];
      } else if (area === "Jawa Tengah") {
        matchedAreas = ["Semarang"];
      } else if (area === "Jawa Timur") {
        matchedAreas = ["Surabaya"];
      } else if (area === "Sumatera") {
        matchedAreas = ["Medan"];
      }
      salesQuery += " AND area IN (?)";
      salesParams.push(matchedAreas);
    }"""

content = content.replace("""    } else if (area && area !== "Semua Area") {
      salesQuery += " AND area = ?";
      salesParams.push(area);
    }""", replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated targetController.js")
