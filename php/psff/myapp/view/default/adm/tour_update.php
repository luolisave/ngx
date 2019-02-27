<?php  extract($GLOBALS['data']);  ?>

<h1>Update Tour</h1>

<form method="post" action="<?php echo SITE_URL."/index.php?s=adm/tour_update/id/".$_GET['id'] ?>">
<table>
    
    <tbody>
        
        <tr>
            <th>title</th>
            <td><input name="title" value="<?php if(!empty($data['title']))echo $data['title']; ?>" /></td>
        </tr>
        <tr>
            <th>unit_number</th>
            <td><input name="unit_number" value="<?php if(!empty($data['unit_number']))echo $data['unit_number']; ?>" /></td>
        </tr>
        <tr>
            <th>street_number</th>
            <td><input name="street_number" value="<?php if(!empty($data['street_number']))echo $data['street_number']; ?>" /></td>
        </tr>
        <tr>
            <th>street_name</th>
            <td><input name="street_name" value="<?php if(!empty($data['street_name']))echo $data['street_name']; ?>" /></td>
        </tr>
        <tr>
            <th>street_type</th>
            <td><input name="street_type" value="<?php if(!empty($data['street_type']))echo $data['street_type']; ?>" /></td>
        </tr>
        <tr>
            <th>street_direction</th>
            <td><input name="street_direction" value="<?php if(!empty($data['street_direction']))echo $data['street_direction']; ?>" /></td>
        </tr>
        <tr>
            <th>city</th>
            <td><input name="city" value="<?php if(!empty($data['city']))echo $data['city']; ?>" /></td>
        </tr>
        <tr>
            <th>province</th>
            <td><input name="province" value="<?php if(!empty($data['province']))echo $data['province']; ?>" /></td>
        </tr>
        <tr>
            <th>country</th>
            <td><input name="country" value="<?php if(!empty($data['country']))echo $data['country']; ?>" /></td>
        </tr>
        <tr>
            <th>price</th>
            <td><input name="price" value="<?php if(!empty($data['price']))echo $data['price']; ?>" /></td>
        </tr>
        <tr>
            <th>notes</th>
            <td><textarea name="notes" ><?php if(!empty($data['notes']))echo $data['notes']; ?></textarea></td>
        </tr>
        
        <tr>
            <th>status</th>
            <td><input name="status" value="<?php if(!empty($data['status']))echo $data['status']; ?>" />(1:active, 0:inactive)</td>
        </tr>
        
        <tr>
            <th></th>
            <td><input type="submit" value="Update" /></td>
        </tr>
    </tbody>
</table>
</form>

<?php //var_dump($data); ?>