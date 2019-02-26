<?php
/*
<!--
@Author: Li Luo
@Version: 2
@Date:   2016-11-04T16:11:10-04:00
@Last modified by:   Li Luo
@Last modified time: 2016-11-07T13:43:02-05:00
-->
*/
class Database {
    public $dbh;
    public $options = array();
    public $last_sql = '';
    public $debug = false;

    function __construct($dsn, $username = '', $password = '') {
        try {
            $this->dbh = new PDO($dsn, $username, $password);
        } catch (Exception $e) {
            echo 'Connection failed: ' . $e->getMessage();
            $dsn = null;
        }
    }

    public function __call($func, $args) {
        if (in_array($func, array('from', 'field', 'join', 'order', 'where', 'limit'))) {
            if ($func == 'from') {
                $this->options = array();
            }
            $this->options[$func] = $args;
            return $this;
        }
    }

    public function query($sql) {
        if (empty($sql)) {
            return false;
        }
        $sql = trim($sql);
        $this->last_sql = $sql;
        if($this->debug)echo $this->last_sql;
        try {
            $is_select = substr($sql, 0, 6);
            if ($is_select == 'SELECT') {
                $sth = $this->dbh->query($sql);
                $result = array();
                while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                    $result[] = $row;
                }
                return $result;
            } else {
                $sth = $this->dbh->exec($sql);
                return $sth;
            }
        } catch (Exception $e) {
            error_log('Caught exception : ' . $e->getMessage());
            return false;
        }
    }

    public function select() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT {$this->options['field'][0]} FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        return $rs;
    }

    public function find() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT {$this->options['field'][0]} FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        if (!empty($rs[0])) {
            return $rs[0];
        } else {
            return $rs;
        }
    }

    public function count() {
        if (empty($this->options['field'][0])) {
            $this->options['field'][0] = '*';
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = " WHERE {$this->options['where'][0]} ";
        }
        if (empty($this->options['limit'][0])) {
            $limit = '';
        } else {
            $limit = " LIMIT {$this->options['limit'][0]} ";
        }
        if (empty($this->options['order'][0])) {
            $order = '';
        } else {
            $order = " ORDER BY {$this->options['order'][0]} ";
        }
        $sql = "SELECT COUNT(*) as count FROM {$this->options['from'][0]} {$where} {$order} {$limit}";

        $rs = $this->query($sql);
        return $rs[0]['count'];
    }

    public function add($data) {
        if (!is_array($data)) {
            return false;
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }

        $sql_field = array();
        $sql_value = array();
        foreach ($data as $key => $value) {
            $sql_field[] = '`' . $key . '`';
            $sql_value[] = "'" . $value . "'";
        }
        $sql_field = implode(',', $sql_field);
        $sql_value = implode(',', $sql_value);

        $sql = "INSERT INTO {$this->options['from'][0]}
                ($sql_field)
                VALUES
                ($sql_value);";

        $rs = $this->query($sql);
        return $rs;
    }

    public function update($data) {
        if (!is_array($data)) {
            return false;
        }
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }

        $sql_field = array();
        foreach ($data as $key => $value) {
            $sql_field[] = '"' . $key . '" = "' . $value . '"';
        }
        $sql_update = implode(" , ", $sql_field);

        $sql = "UPDATE {$this->options['from'][0]}
                SET $sql_update $where";

        $rs = $this->query($sql);
        return $rs;
    }

    public function delete() {
        if (empty($this->options['where'][0])) {
            $where = "";
        } else {
            $where = "WHERE {$this->options['where'][0]} ";
        }
        $sql = "DELETE FROM {$this->options['from'][0]} $where";

        $rs = $this->query($sql);
        return $rs;
    }

}
