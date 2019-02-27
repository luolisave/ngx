<?php  extract($GLOBALS['data']);  ?>

<h1>List</h1>
<a href="<?php echo SITE_URL."/index.php?s=adm/tour_add" ?>" >Add New Tour</a>

<table class="mytable">
    <thead>
        <tr>
            <th>ID</th>
            <th>title</th>
            <th>unit_number</th>
            <th>street_number</th>
            <th>street_name</th>
            <th>street_type</th>
            <th>street_direction</th>
            <th>city</th>
            <th>province</th>
            <th>country</th>
            <th>price</th>
            <th>notes</th>
            <th>create_date</th>
            <th>update_date</th>
            <th>status</th>
            <th>Options</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach($data as $key => $value){ ?>
        <tr>
            <td><?php echo $value['id'] ?></td>
            <td><?php echo $value['title'] ?></td>
            <td><?php echo $value['unit_number'] ?></td>
            <td><?php echo $value['street_number'] ?></td>
            <td><?php echo $value['street_name'] ?></td>
            <td><?php echo $value['street_type'] ?></td>
            <td><?php echo $value['street_direction'] ?></td>
            <td><?php echo $value['city'] ?></td>
            <td><?php echo $value['province'] ?></td>
            <td><?php echo $value['country'] ?></td>
            <td><?php echo $value['price'] ?></td>
            <td><?php echo $value['notes'] ?></td>
            <td><?php echo $value['create_date'] ?></td>
            <td><?php echo $value['update_date'] ?></td>
            <td><?php echo $value['status'] ?></td>
            <td>
                <a href="<?php echo SITE_URL."/index.php?s=adm/tour_update/id/{$value['id']}" ?>" >Update</a>
                 | 
                <a href="<?php echo SITE_URL."/index.php?s=adm/tour_delete/id/{$value['id']}" ?>" >Delete</a>
            </td>
        </tr>
        <?php } ?>
    </tbody>
</table>

<?php //var_dump($data); ?>