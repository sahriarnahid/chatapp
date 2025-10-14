<!-- Your Name, NEPTUN Code, 6/1 Work -->
<!DOCTYPE html>
<html>
<body>
<h3>Enter tags separated by comma and space (, )</h3>

<form method="post">
  <input type="text" name="tags" placeholder="e.g. Peter, homework, easy, exam, course, PHP" style="width:400px;">
  <input type="submit" value="Submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = $_POST["tags"];
    $tags = explode(", ", $input);
    echo "<h4>Tags Array:</h4>";
    echo "<pre>";
    print_r($tags);
    echo "</pre>";
}
?>
</body>
</html>
