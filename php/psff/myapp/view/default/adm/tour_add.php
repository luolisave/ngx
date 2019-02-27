<?php  extract($GLOBALS['data']);  ?>

<h1>Add New Tour</h1>

<form method="post" action="<?php echo SITE_URL."/index.php?s=adm/tour_add" ?>">
<table>
    
    <tbody>
        
        <tr>
            <th>title</th>
            <td><input name="title" /></td>
        </tr>
        <tr>
            <th>unit_number</th>
            <td><input name="unit_number" /></td>
        </tr>
        <tr>
            <th>street_number</th>
            <td><input name="street_number" /></td>
        </tr>
        <tr>
            <th>street_name</th>
            <td><input name="street_name" /></td>
        </tr>
        <tr>
            <th>street_type</th>
            <td><input name="street_type" /></td>
        </tr>
        <tr>
            <th>street_direction</th>
            <td><input name="street_direction" /></td>
        </tr>
        <tr>
            <th>city</th>
            <td><input name="city" /></td>
        </tr>
        <tr>
            <th>province</th>
            <td><input name="province" /></td>
        </tr>
        <tr>
            <th>country</th>
            <td><input name="country" /></td>
        </tr>
        <tr>
            <th>price</th>
            <td><input name="price" /></td>
        </tr>
        <tr>
            <th>notes</th>
            <td><textarea name="notes"></textarea></td>
        </tr>
        
        <tr>
            <th>status</th>
            <td><input name="status" value="1" />(1:active, 0:inactive)</td>
        </tr>
        
        <tr>
            <th></th>
            <td><input type="submit" value="Add" /></td>
        </tr>
    </tbody>
</table>
</form>

<?php //var_dump($data); ?>
<?php //var_dump($_POST); ?>